declare module 'react-use-keypress' {
  export default function useKeyPress(
    keys: string[] | string,
    callback: (event: KeyboardEvent) => void
  ): void;
}
