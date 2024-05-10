import { IconProps } from '@/types/misc/Icon';

function PauseIcon(props: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="4" y="3" width="6" height="18" rx="2" />
      <rect x="14" y="3" width="6" height="18" rx="2" />
    </svg>
  );
}

export { PauseIcon };
