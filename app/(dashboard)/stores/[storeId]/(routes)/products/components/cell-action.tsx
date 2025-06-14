import React, { useState, useCallback } from "react";
import { ProductColumn } from "@/app/(dashboard)/stores/[storeId]/(routes)/products/components/column";
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
import {
  useDropdownHandlers,
  useModalHandlers,
  useNavigationHandlers,
} from "@/hooks/useCellActionUtils";

interface CellActionProps {
  data: ProductColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Cross-browser clipboard copy function

  const onCopy = useCallback((id: string) => {
    try {
      // Create temporary input element
      const tempInput = document.createElement("textarea");
      tempInput.value = id;

      // Add to DOM but make it invisible
      tempInput.style.position = "absolute";
      tempInput.style.left = "-9999px";
      document.body.appendChild(tempInput);

      // Select the text and copy it
      tempInput.select();
      document.execCommand("copy");

      // Remove the element
      document.body.removeChild(tempInput);

      toast.success("Product ID copied to clipboard");
    } catch (error) {
      console.error("Copy error:", error);
      toast.error("Failed to copy product ID");
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
      await axios.delete(`/api/stores/${params?.storeId}/products/${data.id}`);

      toast.success("Product deleted.");

      // Close modal before refreshing page
      setOpen(false);

      // Use timeout to ensure modal state is updated before page refresh
      setTimeout(() => {
        window.location.href = `/stores/${params.storeId}/products`;
      }, 300);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Make sure you removed all products and categories first.");
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
              handleNavigate(`/stores/${params.storeId}/products/${data.id}`),
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
