import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface SettingsDialogProps {
    currentEndpoint: string;
    onSave: (endpoint: string) => void;
}

export function SettingsDialog({ currentEndpoint, onSave }: SettingsDialogProps) {
    const [endpoint, setEndpoint] = useState(currentEndpoint || "");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setEndpoint(currentEndpoint);
    }, [currentEndpoint]);

    const handleSave = () => {
        if (!endpoint.trim()) {
            toast.error("Endpoint cannot be empty");
            return;
        }
        onSave(endpoint);
        setOpen(false);
        toast.success("Settings saved");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription>
                        Configure the AI chatbot settings here.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="endpoint" className="text-right">
                            API URL
                        </Label>
                        <Input
                            id="endpoint"
                            value={endpoint}
                            onChange={(e) => setEndpoint(e.target.value)}
                            className="col-span-3"
                            placeholder="https://..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
