// QueryType and MutationType are not included here because they would create a circular dependency
// In a real es6 env a temporal deadzone error would be thrown,
//   but babel only ignores it and make some modules undefined.
// Good reading: https://esdiscuss.org/topic/how-to-solve-this-basic-es6-module-circular-dependency-problem
export { default as TodoType } from './TodoType'
export { default as UserType } from './UserType'
