class BaseError extends Error {
    public readonly statusCode: number;
    public readonly code?: string;

    constructor(
        message: string,
        statusCode = 500,
        code?: string
    ) {
        super(message);

        this.name = new.target.name;
        this.statusCode = statusCode;
        this.code = code;

        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, this.constructor);
    }
}

class UsuarioNaoEncontradoError extends BaseError {
    constructor() {
        super('Usuário não encontrado.', 404, 'USER_NOT_FOUND');
    }
}

export { BaseError, UsuarioNaoEncontradoError };