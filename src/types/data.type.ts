export type SelectedDataPlan = {
  id: string;
  name: string;
  size: string;
  validity: string;
  price: number;
};



export interface DataPlanDto {
  id: number;
  name: string;
  description?: string;
  price: string; // API sends string 
  planId?: string;        // Airtel, Glo
  tarrifTypeId?: string;  // MTN, 9mobile
}


export type DataTypeOption = {
  serviceId: string;
  dataType: string;
  label: string;
  networkName?: string;
};

export type DataTypesResponse = {
  requiresDataTypeSelection: boolean;
  items: DataTypeOption[];
};

export type InitiateDataPayload = {
  provider: string;
  phone: string;
  amount: number;
  planId: string;
  serviceId?: string;
};

export type InitiateDataResponse = {
  message: string;
  authorization_url: string;
  reference: string;
};