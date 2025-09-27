import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface CTAModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "private" | "external";
  isLoggedIn: boolean;
  onLogin: () => void;
}

export function CTAModal({
  isOpen,
  onClose,
  type,
  isLoggedIn,
  onLogin,
}: CTAModalProps) {
  if (type === "private") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md rounded-xl glass border border-white/20">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              {isLoggedIn
                ? "This student is looking for a roommate."
                : "Sign in to connect"}
            </DialogTitle>
          </DialogHeader>
          <div className="pt-4 pb-2">
            <p className="text-gray-600 text-center mb-6">
              {isLoggedIn
                ? "Ready to send them your profile summary?"
                : "Create an account or sign in to request to join and get matched with roommates."}
            </p>
            <div className="flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <Button
                    className="w-full gradient-primary hover:opacity-90 text-white rounded-xl py-3 shadow-lg"
                    onClick={onClose}
                  >
                    Send Profile via Email
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-gray-800"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full bg-white hover:bg-gray-100 text-primary rounded-xl py-3 shadow-lg"
                  onClick={() => {
                    onLogin();
                    onClose();
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-xl gradient-modal border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            This is an empty apartment.
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4 pb-2">
          <p className="text-gray-600 text-center mb-6">What's your plan?</p>
          <div className="flex flex-col gap-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3"
              onClick={onClose}
            >
              Save to find roommates
            </Button>
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-3"
              onClick={onClose}
            >
              Share with friends
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
