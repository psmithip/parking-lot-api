type CustomErrorParams = {
  message: string;
  statusCode?: number;
};

export class CustomError extends Error {
  statusCode?: number;

  constructor(params: CustomErrorParams) {
    super(params.message);

    this.name = 'customError';
    this.message = params.message;
    this.statusCode = params.statusCode;
  }
}
