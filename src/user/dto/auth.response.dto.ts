import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    type: 'object',
    properties: {
      accessToken: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidGhlZ2xvcnlAZ21haWwuY29tIiwiaWF0IjoxNjgxMTA3ODczLCJleHAiOjE2ODExMTE0NzN9.hiIhxupsK4--0TwrgZcEIZb0Aa5ZeE5oOma63splN3g',
      },
      refreshToken: {
        type: 'string',
        example:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImVtYWlsIjoidGhlZ2xvcnlAZ21haWwuY29tIiwiaWF0IjoxNjgxMTA3ODczLCJleHAiOjE2ODM2OTk4NzN9.2pnHYbY0p3n4C9syEc448c5Cs7ej9d7L21jWwG5QZA8',
      },
    },
  })
  readonly tokens: object;
}
