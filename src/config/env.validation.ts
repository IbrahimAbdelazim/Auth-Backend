import { plainToInstance, Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  @IsNotEmpty({ message: 'MONGO_URI is required' })
  MONGO_URI: string;

  @IsString({ message: 'JWT_SECRET must be a string' })
  @IsNotEmpty({ message: 'JWT_SECRET is required' })
  JWT_SECRET: string;

  @IsString({ message: 'JWT_EXPIRES_IN must be a string (e.g., "1h", "7d")' })
  @IsNotEmpty({ message: 'JWT_EXPIRES_IN is required' })
  JWT_EXPIRES_IN: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value as string, 10))
  @IsNumber({}, { message: 'PORT must be a number' })
  @Min(1, { message: 'PORT must be greater than 0' })
  @Max(65535, { message: 'PORT must be less than 65536' })
  PORT?: number;

  @IsOptional()
  @IsString()
  NODE_ENV?: string;
}

export function validateEnvironment(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
    whitelist: false,
    forbidNonWhitelisted: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = error.constraints;
        return constraints ? Object.values(constraints).join(', ') : '';
      })
      .filter((message) => message.length > 0);

    throw new Error(
      `Environment validation failed:\n${errorMessages.join('\n')}`,
    );
  }

  return validatedConfig;
}
