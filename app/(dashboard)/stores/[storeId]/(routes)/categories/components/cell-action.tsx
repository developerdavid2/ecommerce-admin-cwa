import React, { useState, useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "next/navigation";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";
import { CategoryColumn } from "@/app/(dashboard)/stores/[storeId]/(routes)/categories/components/column";
import {
  useDropdownHandlers,
  useModalHandlers,
  useNavigationHandlers,
} from "@/hooks/useCellActionUtils";

interface CellActionProps {
  data: CategoryColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const params = useParams();
  const [isDeleting, setIsDeleting] = useState(false);

  // Use useCallback for better performance and stability
  const onCopy = useCallback((id: string) => {
    try {
      // Try the modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(id)
          .then(() => {
            toast.success("Category ID copied to clipboard");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy category ID");
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    // Force focus back to the document body when modal closes
    setOpen(false);
    // Return focus to the document
    setTimeout(() => {
      document.body.focus();
    }, 0);
  }, []);

  const onDelete = useCallback(async () => {
    try {
      setIsDeleting(true);
      await axios.delete(
        `/api/stores/${params?.storeId}/categories/${data.id}`,
      );

      toast.success("Size deleted.");

      // Close modal before refreshing page
      setOpen(false);

      // Use timeout to ensure modal state is updated before page refresh
      setTimeout(() => {
        window.location.href = `/stores/${params.storeId}/categories`;
      }, 300);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Make sure you removed all products first.");
    } finally {
      setIsDeleting(false);
    }
  }, [params, data.id]);

  const { handleOpenModal } = useModalHandlers({
    setOpen,
    setIsDropdownOpen,
  });

  const { handleNavigate } = useNavigationHandlers();

  const { handleDropdownItemClick } = useDropdownHandlers(setIsDropdownOpen);
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={handleCloseModal}
        onConfirm={onDelete}
        loading={isDeleting}
      />
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          // Ensure dropdown properly closes
          onEscapeKeyDown={() => setIsDropdownOpen(false)}
          onInteractOutside={() => setIsDropdownOpen(false)}
        >
          <DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={handleDropdownItemClick(() => onCopy(data.id))}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={handleDropdownItemClick(() =>
              handleNavigate(`/stores/${params.storeId}/categories/${data.id}`),
            )}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer gap-2"
            onClick={handleOpenModal}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
