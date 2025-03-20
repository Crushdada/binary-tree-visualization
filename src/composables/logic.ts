
export class TreeNode {
    constructor(
        public val?: number,
        public left?: TreeNode | null,
        public right?: TreeNode | null) {
        this.val = (val === undefined ? 0 : val)
        this.left = (left === undefined ? null : left)
        this.right = (right === undefined ? null : right)
    }
};

/**
 * 根据层序遍历数组生成JSON二叉树
 * @param array 
 * @returns JSON Tree
 */
export const generateTree = (arr: Array<any>) => {
    let tree = new TreeNode(arr[0]);
    let Nodes = [tree];
    let i = 1;
    for (let node of Nodes) {
        if (arr[i] !== null) {
            Nodes.push((node.left = new TreeNode(arr[i])));
        } else {
            node.left = null;
        }
        i += 1;
        if (i == arr.length) return tree;
        if (arr[i] !== null) {
            Nodes.push((node.right = new TreeNode(arr[i])));
        } else {
            node.right = null;
        }
        i += 1;
        if (i == arr.length) return tree;
    }
}
/**
 * 根据JSON树生成二叉树层序数组
 * @param node 
 * @returns array
 */
export const bfs = (node:any) => {
    let result = [];
    let queue = [];
    queue.push(node);
    let pointer = 0;
    while (pointer < queue.length) {
        let node = queue[pointer++]; // // 这里不使用 shift 方法（复杂度高），用一个指针代替
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }
    let n = result.length - 1;
    while (!result[n]) {
        result.pop();
        n--;
    }
    return result;
}