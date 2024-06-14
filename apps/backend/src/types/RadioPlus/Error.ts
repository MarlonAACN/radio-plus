type Error = ErrorConstructor & {
  status: number;
  message: string;
};

export type { Error };
