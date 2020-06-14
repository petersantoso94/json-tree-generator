import React, { useState } from 'react';
import './App.css';

export interface IJsonData {
  parent: string;
  name: string;
}

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

const parentToggleHandler = function (event: any) {
  let getCurrentParent = event.target.parentElement.querySelector(".nested");
  if (getCurrentParent) getCurrentParent.classList.toggle("active");
  event.target.classList.toggle("caret-down");
}

const TreeComponent: React.FC<ITreeComponentProps> = ({ parent, treeChildren, level }) => {
  if (!treeChildren || treeChildren.length === 0) return (
    <li>
      <span>{parent}</span>
    </li>
  )
  const treeComponentRecur: any = [];
  treeChildren.forEach((child: any) => { Object.keys(child).forEach(tparent => treeComponentRecur.push((<TreeComponent parent={tparent} level={level + 1} treeChildren={child[tparent]} key={level + tparent}></TreeComponent>))) });
  return (
    <li>
      <span className="caret" onClick={parentToggleHandler}>{parent} (child : {treeChildren.length})</span>
      <ul className="nested">
        {treeComponentRecur}
      </ul>
    </li>
  )
}

const App = () => {
  // form input 
  const [parentInput, setparentInput] = useState("")
  const [treeInput, settreeInput] = useState<IJsonData[]>([])
  const [printTree, setprintTree] = useState(false)

  let treeStructure = null;
  if (printTree && parentInput && treeInput && treeInput.length > 0) {
    let filteredArr = treeInput.filter((v, i, a) => a.findIndex(t => (t.name === v.name && t.parent === v.parent)) === i)
    let treeData = treeRecursive(parentInput, [...filteredArr]);
    treeStructure = Object.keys(treeData).map(parent => (<TreeComponent key={0 + parent} parent={parent} treeChildren={treeData[parent]} level={0}></TreeComponent>))
  }

  const setTreeFunctionHandler = () => {
    if (parentInput) {
      setprintTree(true)
    } else {
      alert("Please set root id!")
    }
  }
  const rootIdOnchangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (printTree) {
      setprintTree(false);
    }
    setparentInput(event.target.value)
  }
  const jsonFileInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]
    if (!file || file.type !== "application/json") {
      event.target.value = "";
      alert("Please choose a valid file");
      return;
    }
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(file);
  }
  const onReaderLoad = (event: any) => {
    try {
      let jsonObject: IJsonData[] = JSON.parse(event.target.result);
      settreeInput(jsonObject);
    } catch (error) {
      alert(error)
    }
  }
  return (
    <div className="App">
      Root id *: <input type="text" onChange={rootIdOnchangeHandler} value={parentInput}></input>
      Json File *: <input type="file" onChange={jsonFileInputHandler} accept=".json"></input>
      <button onClick={setTreeFunctionHandler}>Set Tree</button>
      <ul id="myUL">
        {treeStructure}
      </ul>
    </div>
  );
}

export default App;
