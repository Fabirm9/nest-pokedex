import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>,
    
    private readonly http : AxiosAdapter){

  }

  async executeSeed(){

    await this.pokemonModel.deleteMany({}); 

    // const insertPromisesArray = [];
    
    // data.results.forEach(({name,url}) =>{ 
    //   const segments= url.split('/');
    //   const noPokemon:number = +segments[segments.length - 2];
    //   //await this.pokemonModel.create({no:noPokemon, name });

    //   insertPromisesArray.push(
    //     this.pokemonModel.create({no:noPokemon, name })
    //   )
    // })

    // await Promise.all(insertPromisesArray);
    
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert : {name:string , no: number}[] = [];
    
    data.results.forEach(({name,url}) =>{ 
      const segments= url.split('/');
      const noPokemon:number = +segments[segments.length - 2];
      //await this.pokemonModel.create({no:noPokemon, name });

      pokemonToInsert.push({name, no: noPokemon})
    })

    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }
}
