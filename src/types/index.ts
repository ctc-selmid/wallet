export interface Card {
  title: string;
  issuedBy: string;
  backgroundColor: string;
  textColor: string;
  logo: {
    uri: string;
    description: string;
  };
  description: string;
}

export interface RequiredToken {
  configuration: string;
  client_id: string;
  redirect_uri: string;
}

export interface RequiredAttestation {
  idTokens: RequiredToken[];
}

export interface AcquiredIdToken {
  [id: string]: string;
}

export interface AcquiredAttestation {
  idTokens: AcquiredIdToken;
}

export interface Manifest {
  display: {
    card: Card;
    contract: string;
  };
  input: {
    attestations: RequiredAttestation;
    credentialIssuer: string;
  };
}

export interface IdTokenConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
}

export interface PresentationDefinition {
  input_descriptors: {
    issuance: {
      manifest: string;
    }[];
  }[];
}

export interface VCRequest {
  prompt?: string;
  redirect_uri?: string;
  presentation_definition: PresentationDefinition;
  nonce?: string;
  state?: string;
}
