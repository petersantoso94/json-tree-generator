import * as React from 'react';

export interface ILeafNodeProps {
    children: React.ReactNode;
}

const LeafNode: React.FC<ILeafNodeProps> = (props: ILeafNodeProps) => (
    <div>
        {props.children}
    </div>
)


export default LeafNode;
