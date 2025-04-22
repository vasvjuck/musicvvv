import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface BulkActionsProps {
    isAllSelected: boolean;
    selectedCount: number;
    onSelectAll: (checked: boolean) => void;
    onDelete: () => void;
}

const containerVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
        height: '60px',
        opacity: 1,
        transition: { type: 'spring', stiffness: 450, damping: 40 },
    },
    exit: {
        height: 0,
        opacity: 0,
        transition: { duration: 0.2, ease: 'easeInOut' },
    },
};

export const BulkActions: React.FC<BulkActionsProps> = ({
    isAllSelected,
    selectedCount,
    onSelectAll,
    onDelete,
}) => {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                    className="overflow-hidden"
                >
                    <Card className="bg-secondary py-2">
                        <CardContent className="flex items-center justify-between ">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    data-testid="select-all"
                                    checked={isAllSelected}
                                    onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                                />
                                <span className="text-sm font-medium">
                                    {selectedCount} selected
                                </span>
                            </div>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        data-testid="bulk-delete-button" variant="destructive"
                                        size="sm"
                                    >
                                        <Trash2 className="mr-1" size={16} /> Delete Selected ({selectedCount})
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Tracks</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete {selectedCount} tracks? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={onDelete}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
