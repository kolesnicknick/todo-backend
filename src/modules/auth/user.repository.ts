import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;
    const user = new User();
    user.username = username;
    const salt = await bcrypt.genSalt();
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    try {
      await user.save();
    }
    catch (e) {
      if (e.code == 23505) {
        throw new ConflictException('Username already exists');
      } else throw new InternalServerErrorException('Server error');
    }
  }


  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    return this.validateUserPassword(authCredentialsDto);
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });
    if (await bcrypt.hash(password, user.salt) === user.password) {
      return user.username;
    } else throw new UnauthorizedException('Password is not valid');
  }

  async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
