/* eslint-disable no-param-reassign */
import { max } from "d3-array";
import {getTraitFromNode, getDivFromNode, getBranchMutations} from "../../../util/treeMiscHelpers";
import { NODE_VISIBLE } from "../../../util/globals";

/** get a string to be used as the DOM element ID
 * Note that this cannot have any "special" characters
 */
export const getDomId = (type, strain) => {
  // Replace non-alphanumeric characters with dashes (probably unnecessary)
  const name = `${type}_${strain}`.replace(/(\W+)/g, '-');
  return CSS.escape(name);
};

/**
 * this function takes a call back and applies it recursively
 * to all child nodes, including internal nodes
 * @param {PhyloNode} node
 * @param {Function} func - function to apply to each children. Is passed a single argument, the <PhyloNode> of the children.
 */
export const applyToChildren = (phyloNode, func) => {
  func(phyloNode);
  const node = phyloNode.n;
  if ((!node.hasChildren) || (node.children === undefined)) { // in case clade set by URL, terminal hasn't been set yet!
    return;
  }
  for (const child of node.children) {
    applyToChildren(child.shell, func);
  }
};

/** setDisplayOrderRecursively
 * Calculates the display order of all nodes, which corresponds to the vertical position
 * of nodes in a rectangular tree.
 * If `yCounter` is undefined then we wish to hide the node and all descendants of it
 * @param {PhyloNode} node
 * @param {function} incrementer
 * @param {int|undefined} yCounter
 * @sideeffect modifies node.displayOrder and node.displayOrderRange
 * @returns {int|undefined} current yCounter after assignment to the tree originating from `node`
 */
export const setDisplayOrderRecursively = (node, incrementer, yCounter) => {
  const children = node.n.children; // (redux) tree node
  if (children && children.length) {
    for (let i = children.length - 1; i >= 0; i--) {
      yCounter = setDisplayOrderRecursively(children[i].shell, incrementer, yCounter);
    }
  } else {
    if (node.n.fullTipCount !== 0 && yCounter !== undefined) {
      yCounter += incrementer(node);
    }
    node.displayOrder = yCounter;
    node.displayOrderRange = [yCounter, yCounter];
    return yCounter;
  }
  /* if here, then all children have displayOrders, but we don't. */
  node.displayOrder = children.reduce((acc, d) => acc + d.shell.displayOrder, 0) / children.length;
  node.displayOrderRange = [children[0].shell.displayOrder, children[children.length - 1].shell.displayOrder];
  return yCounter;
};

/**
 * heuristic function to return the appropriate spacing between subtrees for a given tree
 * the returned value is to be interpreted as a count of the number of tips that would
 * otherwise fit in the gap
 */
function _getSpaceBetweenSubtrees(numSubtrees, numTips) {
  if (numSubtrees===1 || numTips<10) {
    return 0;
  }
  if (numSubtrees*2 > numTips) {
    return 0;
  }
  return numTips/20; /* note that it's not actually 5% of vertical space,
                     as the final max yCount = numTips + numSubtrees*numTips/20 */
}

/** setDisplayOrder
 * given nodes, this fn sets <phyloNode>.displayOrder for each node
 * Nodes are the phyloTree nodes (i.e. node.n is the redux node)
 * Nodes must have parent child links established (via createChildrenAndParents)
 * PhyloTree can subsequently use this information. Accessed by prototypes
 * rectangularLayout, radialLayout, createChildrenAndParents
 * side effects: <phyloNode>.displayOrder (i.e. in the redux node) and <phyloNode>.displayOrderRange
 * @param {Object} props
 * @param {Array<PhyloNode>} props.nodes
 * @param {boolean} props.focus
 * @returns {undefined}
 */
export const setDisplayOrder = ({nodes, focus}) => {
  const numSubtrees = nodes[0].n.children.filter((n) => n.fullTipCount!==0).length;
  const numTips = focus ? nodes[0].n.tipCount : nodes[0].n.fullTipCount;
  const spaceBetweenSubtrees = _getSpaceBetweenSubtrees(numSubtrees, numTips);

  // No focus: 1 unit per node
  let incrementer = (_node) => 1;

  if (focus) {
    const nVisible = nodes[0].n.tipCount;
    const nTotal = nodes[0].n.fullTipCount;

    let yProportionFocused = 0.8;
    // Adjust for a small number of visible tips (n<4)
    yProportionFocused = Math.min(yProportionFocused, nVisible / 5);
    // Adjust for a large number of visible tips (>80% of all tips)
    yProportionFocused = Math.max(yProportionFocused, nVisible / nTotal);

    const yPerFocused = (yProportionFocused * nTotal) / nVisible;
    const yPerUnfocused = ((1 - yProportionFocused) * nTotal) / (nTotal - nVisible);

    incrementer = (() => {
      let previousWasVisible = false;
      return (node) => {
        // Focus if the current node is visible or if the previous node was visible (for symmetric padding)
        const y = (node.visibility === NODE_VISIBLE || previousWasVisible) ? yPerFocused : yPerUnfocused;

        // Update for the next node
        previousWasVisible = node.visibility === NODE_VISIBLE;

        return y;
      }
    })();
  }

  let yCounter = 0;
  /* iterate through each subtree, and add padding between each */
  for (const subtree of nodes[0].n.children) {
    if (subtree.fullTipCount===0) { // don't use screen space for this subtree
      setDisplayOrderRecursively(nodes[subtree.arrayIdx], incrementer, undefined);
    } else {
      yCounter = setDisplayOrderRecursively(nodes[subtree.arrayIdx], incrementer, yCounter);
      yCounter+=spaceBetweenSubtrees;
    }
  }
  /* note that nodes[0] is a dummy node holding each subtree */
  nodes[0].displayOrder = undefined;
  nodes[0].displayOrderRange = [undefined, undefined];
};


export const formatDivergence = (divergence) => {
  return divergence > 1 ?
    Math.round((divergence + Number.EPSILON) * 1000) / 1000 :
    divergence > 0.01 ?
      Math.round((divergence + Number.EPSILON) * 10000) / 10000 :
      divergence.toExponential(3);
};


/** get the idx of the zoom node (i.e. the in-view root node).
 * This differs depending on which tree is in view so it's helpful to access it
 * by reaching into phyotree to get it
 */
export const getIdxOfInViewRootNode = (node) => {
  return node.shell.that.zoomNode.n.arrayIdx;
};

/**
 * Are the provided nodes within some divergence / time of each other?
 * NOTE: `otherNode` is always closer to the root in the tree than `node`
 */
function isWithinBranchTolerance(node, otherNode, distanceMeasure) {
  if (distanceMeasure === "num_date") {
    /* We calculate the threshold by reaching into phylotree to extract the date range of the dataset
    and then split the data into ~50 slices. This could be refactored to not reach into phylotree. */
    const tolerance = (node.shell.that.dateRange[1]-node.shell.that.dateRange[0])/50;
    return (getTraitFromNode(node, "num_date") - tolerance < getTraitFromNode(otherNode, "num_date"));
  }

  /* If mutations aren't defined, we fallback to calculating divergence tolerance similarly to temporal.
  This uses the approach used to compute the x-axis grid within phyotree, and could be refactored into a
  helper function. Note that we don't store the maximum divergence on the tree so we use the in-view max instead */
  const tolerance = (node.shell.that.xScale.domain()[1] - node.shell.that.nodes[0].depth)/50;
  return (getDivFromNode(node) - tolerance < getDivFromNode(otherNode));
}

/**
 * Walk up the tree from node until we find either a node which has a nucleotide mutation or we
 * reach the root of the (sub)tree. Gaps, deletions and undeletions do not count as mutations here.
 */
function findFirstBranchWithAMutation(node) {
  if (node.parent === node) {
    return node;
  }
  const categorisedMutations = getBranchMutations(node, {}); // 2nd param of `{}` means we skip homoplasy detection
  if (categorisedMutations?.nuc?.unique?.length>0) {
    return node.parent;
  }

  return findFirstBranchWithAMutation(node.parent);
}

/**
 * Given a `node`, get the parent, grandparent etc node which is beyond some
 * branch length threshold (either divergence or time). This is useful for finding the node
 * beyond a polytomy, or polytomy-like structure. If nucleotide mutations are defined on
 * the tree (and distanceMeasure=div) then we find the first branch with a mutation.
 * @param {object} node - tree node
 * @param {string} distanceMeasure -- 'num_date' or 'div'
 * @param {object} observedMutations
 * @returns {object} the closest node up the tree (towards the root) which is beyond
 * some threshold
 */
export const getParentBeyondPolytomy = (node, distanceMeasure, observedMutations) => {
  let potentialNode = node.parent;
  if (distanceMeasure==="div" && areNucleotideMutationsPresent(observedMutations)) {
    return findFirstBranchWithAMutation(node);
  }
  while (isWithinBranchTolerance(node, potentialNode, distanceMeasure)) {
    if (potentialNode === potentialNode.parent) break; // root node of tree
    potentialNode = potentialNode.parent;
  }
  return potentialNode;
};

function areNucleotideMutationsPresent(observedMutations) {
  const mutList = Object.keys(observedMutations);
  for (let idx=mutList.length-1; idx>=0; idx--) { // start at end, as nucs come last in the key-insertion order
    if (mutList[idx].startsWith("nuc:")) {
      return true;
    }
  }
  return false;
}

/**
 * Prior to Jan 2020, the divergence measure was always "subs per site per year"
 * however certain datasets changed this to "subs per year" across entire sequence.
 * This distinction is not set in the JSON, so in order to correctly display the rate
 * we will "guess" this here. A future augur update will export this in a JSON key,
 * removing the need to guess.
 */
export function guessAreMutationsPerSite(scale) {
  const maxDivergence = max(scale.domain());
  return maxDivergence <= 5;
}

/**
 * Is the node a subtree root node? (implies that we have either exploded trees or
 * the dataset has multiple subtrees to display)
 * @param {ReduxTreeNode} n
 * @returns {bool}
 */
const isSubtreeRoot = (n) => (n.parent.name === "__ROOT" && n.parentInfo.original);

/**
 * Gets the parent node to be used for stem / branch calculation.
 * Most of the time this is the same as `d.n.parent` however it is not in the
 * case of the root nodes for subtrees (e.g. exploded trees).
 * @param {Node} n
 * @returns {Node}
 */
export const stemParent = (n) => {
  return isSubtreeRoot(n) ? n.parentInfo.original : n.parent;
};


/**
 * Returns a function which itself gets the order of the node and that of its parent.
 * This is not strictly the same as the `displayOrder` the scatterplot axis
 * renders increasing values going upwards (i.e. from the bottom to top of screen)
 * whereas the rectangular tree renders zero at the top and goes downwards
 * @param {Array<PhyloNode>} nodes
 * @returns {function} which takes a single argument of type <PhyloNode>
 */
export const nodeOrdering = (nodes) => {
  const maxVal = nodes.map((d) => d.displayOrder)
    .reduce((acc, val) => ((val ?? 0) > acc ? val : acc), 0);
  return (d) => ([
    maxVal - d.displayOrder,
    isSubtreeRoot(d.n) ? undefined : (maxVal - d.n.parent.shell.displayOrder)
  ]);
};
