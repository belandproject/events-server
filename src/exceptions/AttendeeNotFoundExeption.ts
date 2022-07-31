import HttpException from './HttpException';

class AttendeeNotFoundExeption extends HttpException {
  constructor(id: number) {
    super(404, `Attendee with id ${id} not found`);
  }
}

export default AttendeeNotFoundExeption;