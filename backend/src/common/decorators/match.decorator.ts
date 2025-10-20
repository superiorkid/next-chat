import { ClassConstructor } from 'class-transformer';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export const Match = <T>(
  type: ClassConstructor<T>,
  property: (o: T) => unknown,
  validationOptions?: ValidationOptions,
) => {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
};

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const [fn] = args.constraints as [(o: object) => unknown];
    return fn(args.object) === value;
  }

  defaultMessage(args: ValidationArguments) {
    const [constraintPropertyFn] = args.constraints as [(o: object) => unknown];
    const functionName = constraintPropertyFn.name || 'related field';

    return `${functionName} and ${args.property} does not match`;
  }
}
