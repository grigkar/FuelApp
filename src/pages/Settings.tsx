import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useEffect } from "react";

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Settings() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { user, updateUser } = useUser();
  const { toast } = useToast();

  const { register, handleSubmit, control, formState: { errors }, reset } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        display_name: user.display_name || "",
        currency: user.currency,
        unit_system: user.unit_system,
        time_zone: user.time_zone,
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pacific/Kwajalein">(GMT -12:00) Eniwetok, Kwajalein</SelectItem>
                        <SelectItem value="Pacific/Midway">(GMT -11:00) Midway Island, Samoa</SelectItem>
                        <SelectItem value="Pacific/Honolulu">(GMT -10:00) Hawaii</SelectItem>
                        <SelectItem value="Pacific/Marquesas">(GMT -9:30) Taiohae</SelectItem>
                        <SelectItem value="America/Anchorage">(GMT -9:00) Alaska</SelectItem>
                        <SelectItem value="America/Los_Angeles">(GMT -8:00) Pacific Time (US & Canada)</SelectItem>
                        <SelectItem value="America/Denver">(GMT -7:00) Mountain Time (US & Canada)</SelectItem>
                        <SelectItem value="America/Chicago">(GMT -6:00) Central Time (US & Canada), Mexico City</SelectItem>
                        <SelectItem value="America/New_York">(GMT -5:00) Eastern Time (US & Canada), Bogota, Lima</SelectItem>
                        <SelectItem value="America/Caracas">(GMT -4:30) Caracas</SelectItem>
                        <SelectItem value="America/Halifax">(GMT -4:00) Atlantic Time (Canada), La Paz</SelectItem>
                        <SelectItem value="America/St_Johns">(GMT -3:30) Newfoundland</SelectItem>
                        <SelectItem value="America/Sao_Paulo">(GMT -3:00) Brazil, Buenos Aires, Georgetown</SelectItem>
                        <SelectItem value="Atlantic/South_Georgia">(GMT -2:00) Mid-Atlantic</SelectItem>
                        <SelectItem value="Atlantic/Azores">(GMT -1:00) Azores, Cape Verde Islands</SelectItem>
                        <SelectItem value="Europe/London">(GMT +0:00) Western Europe Time, London, Lisbon, Casablanca</SelectItem>
                        <SelectItem value="Europe/Paris">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</SelectItem>
                        <SelectItem value="Europe/Kaliningrad">(GMT +2:00) Kaliningrad, South Africa, Cairo</SelectItem>
                        <SelectItem value="Europe/Moscow">(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg</SelectItem>
                        <SelectItem value="Asia/Tehran">(GMT +3:30) Tehran</SelectItem>
                        <SelectItem value="Asia/Dubai">(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi</SelectItem>
                        <SelectItem value="Asia/Kabul">(GMT +4:30) Kabul</SelectItem>
                        <SelectItem value="Asia/Karachi">(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent</SelectItem>
                        <SelectItem value="Asia/Kolkata">(GMT +5:30) Mumbai, Calcutta, Madras, New Delhi</SelectItem>
                        <SelectItem value="Asia/Kathmandu">(GMT +5:45) Kathmandu, Pokhara</SelectItem>
                        <SelectItem value="Asia/Dhaka">(GMT +6:00) Almaty, Dhaka, Colombo</SelectItem>
                        <SelectItem value="Asia/Yangon">(GMT +6:30) Yangon, Mandalay</SelectItem>
                        <SelectItem value="Asia/Bangkok">(GMT +7:00) Bangkok, Hanoi, Jakarta</SelectItem>
                        <SelectItem value="Asia/Shanghai">(GMT +8:00) Beijing, Perth, Singapore, Hong Kong</SelectItem>
                        <SelectItem value="Australia/Eucla">(GMT +8:45) Eucla</SelectItem>
                        <SelectItem value="Asia/Tokyo">(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk</SelectItem>
                        <SelectItem value="Australia/Adelaide">(GMT +9:30) Adelaide, Darwin</SelectItem>
                        <SelectItem value="Australia/Sydney">(GMT +10:00) Eastern Australia, Guam, Vladivostok</SelectItem>
                        <SelectItem value="Australia/Lord_Howe">(GMT +10:30) Lord Howe Island</SelectItem>
                        <SelectItem value="Pacific/Guadalcanal">(GMT +11:00) Magadan, Solomon Islands, New Caledonia</SelectItem>
                        <SelectItem value="Pacific/Norfolk">(GMT +11:30) Norfolk Island</SelectItem>
                        <SelectItem value="Pacific/Auckland">(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka</SelectItem>
                        <SelectItem value="Pacific/Chatham">(GMT +12:45) Chatham Islands</SelectItem>
                        <SelectItem value="Pacific/Tongatapu">(GMT +13:00) Apia, Nukualofa</SelectItem>
                        <SelectItem value="Pacific/Kiritimati">(GMT +14:00) Line Islands, Tokelau</SelectItem>
                      </SelectContent>
                    </Select>
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
      </main>
    </div>
  );
}
