export type DType = {
  name: string;
  symbol: string;
  moveStatus: string;
  value: number;
};

export type ListMessage = {
  type: "GET_LIST";
};

export type UpdateMessage = {
  type: "UPDATE_LIST";
  data: DType[];
};
