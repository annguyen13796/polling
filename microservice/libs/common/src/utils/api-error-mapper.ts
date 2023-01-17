import {
  NotFoundException,
  UnknownException,
  BadRequestionException,
  UnAuthenticated,
  unAuthorized
} from '../exceptions';
import { Response } from 'express';

export class ApiErrorMapper {
  public static toErrorResponse(error: Error, response: Response) {
    if (error instanceof UnknownException) {
      return response.status(500).send({
        message: error.message
      });
    }
    if (error instanceof UnAuthenticated) {
      return response.status(401).send({
        message: error.message
      });
    }
    if (error instanceof unAuthorized) {
      return response.status(403).send({
        message: error.message
      });
    }

    if (error instanceof BadRequestionException) {
      return response.status(400).send({
        message: error.message
      });
    }

    if (error instanceof NotFoundException) {
      return response.status(404).send({
        message: error.message
      });
    }

    return response.status(500).send({
      message: error.message
    });
  }
}
