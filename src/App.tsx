import React from 'react';
import treedata from './treedata.json';
import './App.css';
import LeafNode from './components/LeafNode';

export interface IJsonData {
  parent: string;
  name: string;
}

let treeData: any = {};

const treeRecursive = (parent: string, children: IJsonData[]) => {
  if (children.length === 0) {
    //stop the iteration
    return parent;
  }
  let childrenFromRecur: any = {};
  childrenFromRecur[parent] = [];
  children.forEach(child => {
    if (child.parent === parent) {
      childrenFromRecur[parent].push(treeRecursive(child.name, children.filter(el => el.name !== child.name)))
    }
  });
  return childrenFromRecur;
}

export interface ITreeComponentProps {
  parent: string,
  treeChildren: any;
  level: number;
}

const TreeComponent: React.FC<ITreeComponentProps> = ({ parent, treeChildren, level }) => {
  if (!treeChildren || treeChildren.length === 0) return (
    <div style={{ marginLeft: `${level * 55}px` }}>
      {parent}</div>
  )
  const treeComponentRecur: any = [];
  treeChildren.forEach((child: any) => { Object.keys(child).forEach(tparent => treeComponentRecur.push((<TreeComponent parent={tparent} level={level + 1} treeChildren={child[tparent]} key={level + tparent}></TreeComponent>))) });
  return (
    <div style={{ marginLeft: `${level * 55}px` }}>
      {parent}
      {treeComponentRecur}
    </div>
  )
}

const App = () => {
  treeData = treeRecursive('0', [...treedata]);
  const treeStructure = Object.keys(treeData).map(parent => (<TreeComponent key={0 + parent} parent={parent} treeChildren={treeData[parent]} level={0}></TreeComponent>))

  return (
    <div className="App">
      {treeStructure}
    </div>
  );
}

export default App;
