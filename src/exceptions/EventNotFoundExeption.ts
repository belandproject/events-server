import HttpException from './HttpException';

class EventNotFoundExeption extends HttpException {
  constructor(id: string) {
    super(404, `Event with id ${id} not found`);
  }
}

export default EventNotFoundExeption;