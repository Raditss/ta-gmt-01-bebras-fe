export interface ContagionProtocolTreeNode {
  // cytoscape tree
  id: string; // identifier
  label: string; // question and answer, e.g. : Bentuk Badan Kotak

  // answer
  attribute: ContagionProtocolTreeAttributeType; // for check answer
  value: ContagionProtocolMonsterAttributeType; // for check answer
}

export interface ContagionProtocolTreeEdge {
  source: ContagionProtocolTreeNode['id'];
  target: ContagionProtocolTreeNode['id'];
}

export interface ContagionProtocolDecisionTree {
  nodes: ContagionProtocolTreeNode[];
  edges: ContagionProtocolTreeEdge[];
}

export enum ContagionProtocolTreeAttributeEnum {
  COLOR = 'Color',
  BODY = 'Body',
  MOUTH = 'Mouth'
}

export type ContagionProtocolTreeAttributeType =
  `${ContagionProtocolTreeAttributeEnum}`;

export enum ContagionProtocolMonsterColorEnum {
  BLUE = 'Blue',
  GREEN = 'Green',
  RED = 'Red'
}

export type ContagionProtocolMonsterColorType =
  `${ContagionProtocolMonsterColorEnum}`;

export enum ContagionProtocolMonsterBodyEnum {
  CUBE = 'Cube',
  ORB = 'Orb'
}

export type ContagionProtocolMonsterBodyType =
  `${ContagionProtocolMonsterBodyEnum}`;

export enum ContagionProtocolMonsterMouthEnum {
  SAD = 'Closedsad',
  HAPPY = 'Closedhappy',
  FANGS = 'Closedfangs'
}

export type ContagionProtocolMonsterMouthType =
  `${ContagionProtocolMonsterMouthEnum}`;

export type ContagionProtocolMonsterAttributeType =
  | ContagionProtocolMonsterColorType
  | ContagionProtocolMonsterBodyType
  | ContagionProtocolMonsterMouthType;

export interface Monster {
  id: string;
  name: string;
  traits: {
    color: ContagionProtocolMonsterColorType;
    body: ContagionProtocolMonsterBodyType;
    mouth: ContagionProtocolMonsterMouthType;
  };
}

export interface ContagionProtocolQuestion {
  tree: ContagionProtocolDecisionTree;
  monsters: Monster[];
}

export interface MonsterForm {
  color?: ContagionProtocolMonsterColorEnum;
  body?: ContagionProtocolMonsterBodyEnum;
  mouth?: ContagionProtocolMonsterMouthEnum;
}

export interface MonsterAnswer {
  id: Monster['id'];
  isNormal?: boolean;
  form: MonsterForm;
}

export interface ContagionProtocolAnswer {
  monsters: MonsterAnswer[];
  currentId?: Monster['id'];
}
