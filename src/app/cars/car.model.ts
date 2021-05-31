import { Ingredient } from '../shared/ingredient.model';

export class car {
  // public name: string;
  // public description: string;
  // public imagePath: string;
  // public ingredients: Ingredient[];

  // constructor(name: string, desc: string, imagePath: string, ingredients: Ingredient[]) {
  //   this.name = name;
  //   this.description = desc;
  //   this.imagePath = imagePath;
  //   this.ingredients = ingredients;
  // }

  public id: number;
  public car: string;
  public car_model: string;
  public car_color: string;
  public car_model_year: number;
  public car_vin: string;
  public price: string;
  public availability: boolean;

  constructor(id:number,car:string,car_model:string,modelYear:number,carColor:string,
    carVIN : string,price:string,availablity:boolean) {
      this.availability= availablity;
      this.car=car;
      this.car_model= car_model;
      this.car_model_year = modelYear,
      this.car_vin = carVIN;
      this.id= id;
      this.price= price;
    
  }
}


