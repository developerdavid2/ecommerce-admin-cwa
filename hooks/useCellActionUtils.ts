import { useCallback } from "react";
import { useRouter } from "next/navigation";

interface UseModalHandlersProps {
  setOpen: (value: boolean) => void;
  setIsDropdownOpen: (value: boolean) => void;
}

export const useModalHandlers = ({
  setOpen,
  setIsDropdownOpen,
}: UseModalHandlersProps) => {
  // Handle opening the modal
  const handleOpenModal = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(true);
      // Close dropdown when opening modal
      setIsDropdownOpen(false);
    },
    [setOpen, setIsDropdownOpen],
  );

  return { handleOpenModal };
};

export const useNavigationHandlers = () => {
  const router = useRouter();

  // Handle navigation
  const handleNavigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router],
  );

  return { handleNavigate };
};

export const useDropdownHandlers = (
  setIsDropdownOpen: (value: boolean) => void,
) => {
  // Handle dropdown item clicks with proper event stopping
  const handleDropdownItemClick = useCallback(
    (callback: () => void) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      callback();
      // Close dropdown after action
      setIsDropdownOpen(false);
    },
    [setIsDropdownOpen],
  );

  return { handleDropdownItemClick };
};
