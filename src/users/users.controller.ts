import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserGuard } from './users.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {};

    // @UseGuards(UserGuard)
    @Get()
    async getUser(@Query('email') email: string) {
        return this.usersService.getUserInformation(email);
    }
}
