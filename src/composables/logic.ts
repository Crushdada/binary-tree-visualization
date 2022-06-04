
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
 * @param arr 
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

