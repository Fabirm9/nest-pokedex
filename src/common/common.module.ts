import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';
import { PaginationDto } from './dto/paginationDto';

@Module({
    providers: [AxiosAdapter],
    exports:[AxiosAdapter]
})
export class CommonModule {}
