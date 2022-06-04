import { Ref } from "vue";
import { BlockState } from "~/types";
// block周围的方向
const directions = [
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, 1],
];

export class GamePlay {
    /**
    * 为了使用useStorage持久化state,采用ref而不是reactive
    * 我们可能需要移除或更新整个state,而reactive会阻止这样做--antf大佬如是说
    **/
    state = ref() as Ref<GameState>
    constructor(public width: number, public hight: number, public mines: number) {
        // 追踪插旗、翻开块的变动，应用检查游戏状态的副作用
        this.reset();
    }
    get board() {
        return this.state.value.board;
    }
    get blocks() {
        return this.state.value.board.flat() as BlockState[];
    }

    // 自动展开
    autoExpand(block: BlockState) {
        const siblings = this.getSiblings(block);
        const flags = siblings.reduce((a, b) => a + (b.flagged ? 1 : 0), 0)
        const notRevealed = siblings.reduce((a, b) => a + (!b.revealed && !b.flagged ? 1 : 0), 0)
        if (flags === block.adjacentMines) {
            siblings.forEach((i) => {
                i.revealed = true
                if (i.mine) {
                    this.onGameOver('lost')
                }
            })
        }
        const missingFlags = block.adjacentMines - flags;
        if (notRevealed === missingFlags) {
            siblings.forEach((i) => { if (!i.revealed && !i.flagged) i.flagged = true })
        }
    }
    // 判断失败
    onGameOver(status: GameStatus) {
        this.state.value.status = status
        this.state.value.endMS = +Date.now()
        if (status === 'lost') {
            this.showAllMines()
            setTimeout(() => {
                alert('lost')
            }, 50)
        }
    }
    // 重置游戏状态
    reset(width = this.width, hight = this.hight, mines = this.mines) {
        this.width = width;
        this.hight = hight;
        this.mines = mines;
        this.state.value = {
            mineGenerated: false,
            status: 'play',
            startMS: +Date.now(),
            board: Array.from({ length: this.hight }, (_, x) =>
                Array.from(
                    { length: this.width },
                    (_, y): BlockState => ({ x, y, adjacentMines: 0, revealed: false })
                )
            )
        }

    }

    showAllMines() {
        this.board.flat().forEach((block) => {
            if (block.mine) {
                block.revealed = true;
            }
        });
    }
    // 检查游戏状态
    checkGameState() {
        if (!this.state.value.mineGenerated) return;
        const blocks = this.board.flat();
        if (blocks.every((block) => block.flagged || block.revealed)) {
            if (blocks.some((block) => { block.flagged && !block.mine })) {
                this.onGameOver('lost')
            } else {
                this.onGameOver('won')
            }
        }
    }
    // 随机生成区间内整数
    random(min: number, max: number) {
        return Math.random() * (max - min) + min;
    }

    // 随机生成区间内整数
    randomInt(min: number, max: number) {
        if (min >= max) throw Error("Illegal input: min >= max");
        return Math.round(this.random(min, max));
    }
    // 随机生成炸弹
    generateMines(initial: BlockState) {
        // 为了指定生成的炸弹数，随机生成的思路由“每个块随机生成炸弹”
        // 转变为 => “随机炸弹的位置”，计数，while循环随机生成坐标，排除非法坐标
        const placeRandom = () => {
            const x = this.randomInt(0, this.hight - 1);
            const y = this.randomInt(0, this.width - 1);
            const block = this.board[x][y];
            if ((Math.abs(initial.x - x) <= 1) && (Math.abs(initial.y - y) <= 1)) return;
            if (block.mine) return;
            minesCount++;
            block.mine = true;
        }
        let minesCount = 0;
        while (minesCount < this.mines) {
            placeRandom();
        }
        this.updateMineNums();
    }
    // 计算每个block周围的炸弹数
    updateMineNums() {
        this.board.forEach((row) => {
            row.forEach((block) => {
                if (block.mine) return;
                this.getSiblings(block).forEach((b) => {
                    if (b.mine) block.adjacentMines += 1;
                });
            });
        });
    }

    // 小帮手：当你翻开一个空的块，游戏会帮你翻开它周遭的空块，并递归这个过程
    expandZero(block: BlockState) {
        if (block.adjacentMines) return;
        // 如果当前块周遭无炸弹
        this.getSiblings(block).forEach((s) => {
            if (!s.revealed) {
                s.revealed = true;
                this.expandZero(s);
            }
        });
    }
    // 获得block周遭的块
    getSiblings(block: BlockState) {
        return directions
            .map(([dx, dy]) => {
                const x = block.x + dx;
                const y = block.y + dy;
                if (x < 0 || x >= this.width || y < 0 || y >= this.hight) return;
                return this.board[x][y];
            })
            .filter(Boolean) as BlockState[];
    }
    // block鼠标右键点击事件
    onRightClick(block: BlockState) {
        if (this.state.value.status !== 'play') return;
        if (block.revealed) return;
        block.flagged = !block.flagged;
    }
    // block鼠标左键点击事件
    onClick(block: BlockState) {
        // 处于游戏中才响应点击事件
        if (this.state.value.status !== 'play') return;
        // 未插旗才可翻开
        if (block.flagged) return;
        // 首次翻开块，指向生成炸弹逻辑
        if (!this.state.value.mineGenerated) {
            this.generateMines(block);
            this.state.value.mineGenerated = true;
        }
        block.revealed = true;
        if (block.mine) {
            this.onGameOver('lost')
            return
        }
        this.expandZero(block);
    }
}