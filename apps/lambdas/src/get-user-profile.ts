import * as AWS from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME || '';
const USER_PROFILE_PK = process.env.USER_PROFILE_PK || '';
const USER_PROFILE_SK = process.env.USER_PROFILE_SK || '';

const db = new AWS.DynamoDB.DocumentClient();

export const handler = async (event: any = {}): Promise<any> => {
  const userId = event.pathParameters.id; // Assumes the user ID is passed in the path
  if (!userId) {
    return {
      statusCode: 400,
      body: `Error: You are missing the path parameter id`,
    };
  }

  const params = {
    TableName: TABLE_NAME,
    Key: {
      PK: `${USER_PROFILE_PK}${userId}`,
      SK: `${USER_PROFILE_SK}${userId}`,
    },
  };

  try {
    const response = await db.get(params).promise();
    if (response.Item) {
      return { statusCode: 200, body: JSON.stringify(response.Item) };
    } else {
      return {
        statusCode: 404,
        body: `Error: User with ID ${userId} not found`,
      };
    }
  } catch (dbError) {
    console.error('Error when trying to fetch user profile:', dbError);
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};
