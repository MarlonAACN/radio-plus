import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import { LogoutButtonView } from '@/components/config/views/LogoutButton';

type ConfigHeaderProps = {
  logout: () => void;
  menuIsOpen: boolean;
};

function ConfigHeaderWidget({ logout, menuIsOpen }: ConfigHeaderProps) {
  return (
    <div className="w-full flex flex-row justify-between items-center pl-2 mb-5">
      <div className="flex flex-row flex-nowrap justify-start items-center gap-x-1.5">
        <AdjustmentsHorizontalIcon className="w-7 h-7" />
        <h2 className="text-3xl font-medium">Settings</h2>
      </div>
      <LogoutButtonView logout={logout} menuIsOpen={menuIsOpen} />
    </div>
  );
}

export { ConfigHeaderWidget };
