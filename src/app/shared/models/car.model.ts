export interface Car {
    id: number;
    name: string;
    car_model: string;
    car_color: number;
    car_model_year: number;
    car_vin:string;
    price:number
    availability:boolean;
  }

export interface CarListData {
  cars:Car[];
  }