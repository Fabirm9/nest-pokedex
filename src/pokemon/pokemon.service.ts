import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/paginationDto';

@Injectable()
export class PokemonService {
  private defaultLimit:number = this.configService.get<number>('default_limit');
  
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel : Model<Pokemon>,
    private readonly configService: ConfigService){
      this.defaultLimit = configService.get<number>('default_limit')
    }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
      
    } catch (error) {
      this.handleExceptions(error,'create');
    }

  }

  findAll(paginationDto : PaginationDto) {
    const {limit=this.defaultLimit, offset=0 } = paginationDto;

    return this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({no:1})
    .select('-__v');
  }

  async findOne(term: string) {
    let pokemon : Pokemon;
    
    if(!isNaN(+term))
      pokemon = await this.pokemonModel.findOne({ no: term });


    if(!pokemon && isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term);

    if(!pokemon)
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim()})
    
    if(!pokemon)
      throw new NotFoundException(`Pokemon with id, name or no ${term} not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne(term);

    if(updatePokemonDto.name)  
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
  
      await pokemon.updateOne(updatePokemonDto);
  
      return { ...pokemon.toJSON(), ...updatePokemonDto} ;
      
    } catch (error) {
      this.handleExceptions(error,'update');
    }

  }

  async remove(id: string) {
    //const pokemon = await this.findOne(id);
    
    //await pokemon.deleteOne();
    //await this.pokemonModel.findByIdAndDelete(id);
    const result = await this.pokemonModel.deleteOne({ _id : id});

    if(result.deletedCount === 0)
      throw new BadRequestException(`No item deleted - not found  `)

    return `pokemon with id ${id} deleted`;
  }

  private handleExceptions(error:any, type:string){
    if(error.code === 11000)
          throw new BadRequestException(`Pokemon exist on db ${JSON.stringify( error.keyValue)}`);

    throw new InternalServerErrorException(`Can't ${type} Pokemon - check server logs`);
  }
}
