import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { dynamoDBClient } from 'src/config/database-config.service';
import { v4 as uuidv4 } from 'uuid';
const { USERS_TABLE } = process.env;

@Injectable()
export class UserService {
  // async createUser(
  //   mobileNumber: string,
  //   language: string,
  //   botID: string,
  // ): Promise<User | any> {
  //   try {
  //     const newUser = {
  //       id: uuidv4(),
  //       mobileNumber: mobileNumber,
  //       language: language,
  //       Botid: botID,
        
  //     };
  //     const params = {
  //       TableName: USERS_TABLE,
  //       Item: newUser,
  //     };
  //     await dynamoDBClient().put(params).promise();
  //     return newUser; // Return just the user object
  //   } catch (error) {
  //     console.error('Error in createUser:', error);
  //   }
  // }

  async createUser(mobileNumber: string, language: string, botID: string): Promise<User | any> {
    try {
      const existingUser = await this.findUserByMobileNumber(
        mobileNumber,
        botID,
      );
      if (existingUser) {
        const updateUser = {
          TableName: USERS_TABLE,
          Item: existingUser,
        };
        await dynamoDBClient().put(updateUser).promise();
        return existingUser;
      } else {
        const newUser = {
          TableName: USERS_TABLE,
          Item: {
            id: uuidv4(),
            mobileNumber: mobileNumber,
            language: language,
            Botid: botID,
            selectedCategory:null,
            setName:  null,
            currentQuestionIndex:  0,
            score: 0,
            currCrouslePage:  0,
            maxCrouselPage: 0,

          },
        };
        await dynamoDBClient().put(newUser).promise();
        return newUser;
      }
    } catch (error) {
      console.error('Error in createUser:', error);
    }
  }
  async findUserByMobileNumber(
    mobileNumber: string,
    Botid: string,
  ): Promise<User | any> {
    try {
      const params = {
        TableName: USERS_TABLE,
        KeyConditionExpression:
          'mobileNumber = :mobileNumber and Botid = :Botid',
        ExpressionAttributeValues: {
          ':mobileNumber': mobileNumber,
          ':Botid': Botid,
        },
      };
      const result = await dynamoDBClient().query(params).promise();
      return result.Items && result.Items.length > 0 ? result.Items[0] : null;// Return the first item or null if none found
    } catch (error) {
      console.error('Error querying user from DynamoDB:', error);
      return null;
    }
  }

  async saveUser(user: User): Promise<User | any> {
   
    const updateUser = {
      TableName: USERS_TABLE,
      Item: user,
    };
    return await dynamoDBClient().put(updateUser).promise();
  }
}
