"use strict";

var _FakeAppointmentsRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentsRepository"));

var _ListProviderDayAvailabilityService = _interopRequireDefault(require("./ListProviderDayAvailabilityService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentRepository;
let listProviderDayAvailability;
describe('listProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new _FakeAppointmentsRepository.default();
    listProviderDayAvailability = new _ListProviderDayAvailabilityService.default(fakeAppointmentRepository);
  });
  it('should be able to list the day availability from provider', async () => {
    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123456',
      date: new Date(2021, 4, 20, 14, 0, 0)
    });
    await fakeAppointmentRepository.create({
      provider_id: 'user',
      user_id: '123456',
      date: new Date(2021, 4, 20, 15, 0, 0)
    });
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 20, 11).getTime();
    });
    const availability = await listProviderDayAvailability.execute({
      provider_id: 'user',
      year: 2021,
      month: 5,
      day: 20
    });
    expect(availability).toEqual(expect.arrayContaining([{
      hour: 8,
      available: false
    }, {
      hour: 9,
      available: false
    }, {
      hour: 10,
      available: false
    }, {
      hour: 13,
      available: true
    }, {
      hour: 14,
      available: false
    }, {
      hour: 15,
      available: false
    }, {
      hour: 16,
      available: true
    }]));
  });
});