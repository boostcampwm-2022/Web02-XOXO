/* eslint-disable no-param-reassign */
const { faker } = require('@faker-js/faker');

function generateRandomPayload(userContext, events, done) {
  userContext.vars.nickname = faker.name.middleName();
  userContext.vars.kakaoId = faker.datatype.number();
  console.log(faker.name.middleName(), faker.datatype.number());
  return done();
}

export default {
  generateRandomPayload,
};
