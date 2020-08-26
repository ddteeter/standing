declare module "particle-api-js" {
  type Device = {
    id: string;
    name: string;
    last_ip_address: string;
    last_heard: string;
    last_handshake_at: string;
    product_id: number;
    online: boolean;
    platform_id: number;
    cellular: boolean;
    notes: string;
    functions: string[];
    variables: { [string]: string };
    status: string;
    serial_number: string;
    system_firmware_version: string;
  };

  type Variable = {
    name: string;
    result: number | string;
    coreInfo: {
      name: string;
      deviceID: string;
      connected: boolean;
      last_handshake_at: string;
    };
  };

  type FunctionResponse = {
    id: string;
    name: string;
    connected: boolean;
    return_value: number;
  };

  type AccessTokenResponse = {
    access_token: string;
  };

  declare class Particle {
    constructor(options?: {
      baseUrl?: string;
      clientSecret?: string;
      clientId?: string;
      tokenDuration?: number;
    });

    setContext(name: string, context: number): void;
    login(options: {
      username: string;
      password: string;
      tokenDuration?: number;
      headers?: { [string]: string };
    }): Promise<{ body: AccessTokenResponse }>;

    sendOtp(options: {
      mfaToken: string;
      otp: string;
      headers?: { [string]: string };
    }): Promise<{ body: AccessTokenResponse }>;

    listDevices(options: {
      deviceId?: string;
      deviceName?: string;
      groups?: string[];
      sortAttr?: string;
      sortDir?: string;
      page?: number;
      perPage?: number;
      product?: string;
      auth: string;
      headers?: { [string]: string };
    }): Promise<{ body: Device[] }>;

    callFunction(options: {
      deviceId: string;
      name: string;
      argument: string;
      product?: string;
      auth: string;
      headers?: { [string]: string };
    }): Promise<{ body: FunctionResponse }>;
  }

  export default Particle;
  export { Device };
}
