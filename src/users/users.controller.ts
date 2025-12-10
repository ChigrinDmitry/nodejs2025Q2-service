import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe,
  } from '@nestjs/common';
  import { UsersService } from './users.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdatePasswordDto } from './dto/update-password.dto';
  
  @Controller('user')
  export class UsersController {
    constructor(private readonly usersService: UsersService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  
    @Get()
    findAll() {
      return this.usersService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
      return this.usersService.findOne(id);
    }
  
    @Put(':id')
    updatePassword(
      @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
      @Body() updatePasswordDto: UpdatePasswordDto,
    ) {
      return this.usersService.updatePassword(id, updatePasswordDto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
      return this.usersService.remove(id);
    }
  }