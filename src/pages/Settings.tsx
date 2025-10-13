import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "@/lib/validation";
import { z } from "zod";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Download } from "lucide-react";
import { exportUserDataAsCSV } from "@/lib/exportData";
import { TimezoneCombobox } from "@/components/TimezoneCombobox";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Settings() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { user, updateUser } = useUser();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currency: "EUR",
      unit_system: "metric",
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        display_name: user.display_name || "",
        currency: user.currency || "EUR",
        unit_system: user.unit_system || "metric",
        time_zone: user.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    }
  }, [user, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateUser(data);
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      // Call the delete_user function which will delete the account and all associated data
      const { error } = await supabase.rpc('delete_user' as any);
      
      if (error) throw error;

      toast({
        title: "Account deleted",
        description: "Your account and all associated data have been permanently deleted.",
      });

      // Log out and redirect to landing page
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportData = async () => {
    if (!user) return;

    setIsExporting(true);
    try {
      await exportUserDataAsCSV(user.id);
      toast({
        title: "Data exported",
        description: "Your data has been downloaded as a CSV file.",
      });
    } catch (error) {
      console.error("Failed to export data:", error);
      toast({
        title: "Export failed",
        description: "Failed to export your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar isAuthenticated={isAuthenticated} onLogout={logout} />

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Card>
          <CardHeader>
            <CardTitle>Profile & Preferences</CardTitle>
            <CardDescription>
              Manage your account settings and display preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  placeholder="Your name"
                  {...register("display_name")}
                />
                {errors.display_name && (
                  <p className="text-sm text-destructive">{errors.display_name.message}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€) - Euro</SelectItem>
                        <SelectItem value="USD">USD ($) - US Dollar</SelectItem>
                        <SelectItem value="GBP">GBP (£) - British Pound</SelectItem>
                        <SelectItem value="JPY">JPY (¥) - Japanese Yen</SelectItem>
                        <SelectItem value="CNY">CNY (¥) - Chinese Yuan</SelectItem>
                        <SelectItem value="CAD">CAD ($) - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD ($) - Australian Dollar</SelectItem>
                        <SelectItem value="CHF">CHF (Fr) - Swiss Franc</SelectItem>
                        <SelectItem value="SEK">SEK (kr) - Swedish Krona</SelectItem>
                        <SelectItem value="NOK">NOK (kr) - Norwegian Krone</SelectItem>
                        <SelectItem value="DKK">DKK (kr) - Danish Krone</SelectItem>
                        <SelectItem value="PLN">PLN (zł) - Polish Zloty</SelectItem>
                        <SelectItem value="CZK">CZK (Kč) - Czech Koruna</SelectItem>
                        <SelectItem value="HUF">HUF (Ft) - Hungarian Forint</SelectItem>
                        <SelectItem value="INR">INR (₹) - Indian Rupee</SelectItem>
                        <SelectItem value="BRL">BRL (R$) - Brazilian Real</SelectItem>
                        <SelectItem value="MXN">MXN ($) - Mexican Peso</SelectItem>
                        <SelectItem value="ZAR">ZAR (R) - South African Rand</SelectItem>
                        <SelectItem value="KRW">KRW (₩) - South Korean Won</SelectItem>
                        <SelectItem value="SGD">SGD ($) - Singapore Dollar</SelectItem>
                        <SelectItem value="NZD">NZD ($) - New Zealand Dollar</SelectItem>
                        <SelectItem value="TRY">TRY (₺) - Turkish Lira</SelectItem>
                        <SelectItem value="RUB">RUB (₽) - Russian Ruble</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.currency && (
                  <p className="text-sm text-destructive">{errors.currency.message}</p>
                )}
              </div>

              {/* Units */}
              <div className="space-y-2">
                <Label htmlFor="unit_system">Units</Label>
                <Controller
                  name="unit_system"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">Metric (km, L)</SelectItem>
                        <SelectItem value="imperial">Imperial (mi, gal)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Choose between metric (kilometers, liters) or imperial (miles, gallons) units
                </p>
              </div>

              {/* Time Zone */}
              <div className="space-y-2">
                <Label htmlFor="time_zone">Time Zone</Label>
                <Controller
                  name="time_zone"
                  control={control}
                  render={({ field }) => (
                    <TimezoneCombobox
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.time_zone && (
                  <p className="text-sm text-destructive">{errors.time_zone.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Data Export Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Export Your Data</CardTitle>
            <CardDescription>
              Download all your data in CSV format for backup or transfer purposes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This will download a CSV file containing all your profile information, vehicles, and fuel entries.
                You can use this to keep a backup or transfer your data to another service.
              </p>
              <Button 
                variant="outline" 
                onClick={handleExportData}
                disabled={isExporting}
              >
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export My Data"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone - Account Deletion */}
        <Card className="mt-8 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that will permanently affect your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data including vehicles, fuel entries, 
                  and statistics. This action cannot be undone.
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={isDeleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete My Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and 
                        remove all your data from our servers including:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Your profile and settings</li>
                          <li>All vehicles</li>
                          <li>All fuel entries and history</li>
                          <li>All statistics and analytics</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Yes, delete my account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
