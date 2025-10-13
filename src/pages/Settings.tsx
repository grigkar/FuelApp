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
                        <SelectItem value="Europe/London">London, United Kingdom (GMT+0:00)</SelectItem>
                        <SelectItem value="Europe/Paris">Paris, France (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Berlin">Berlin, Germany (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Rome">Rome, Italy (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Madrid">Madrid, Spain (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Amsterdam">Amsterdam, Netherlands (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Brussels">Brussels, Belgium (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Vienna">Vienna, Austria (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Prague">Prague, Czech Republic (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Warsaw">Warsaw, Poland (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Stockholm">Stockholm, Sweden (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Oslo">Oslo, Norway (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Copenhagen">Copenhagen, Denmark (GMT+1:00)</SelectItem>
                        <SelectItem value="Europe/Helsinki">Helsinki, Finland (GMT+2:00)</SelectItem>
                        <SelectItem value="Europe/Athens">Athens, Greece (GMT+2:00)</SelectItem>
                        <SelectItem value="Europe/Bucharest">Bucharest, Romania (GMT+2:00)</SelectItem>
                        <SelectItem value="Europe/Istanbul">Istanbul, Turkey (GMT+3:00)</SelectItem>
                        <SelectItem value="Europe/Moscow">Moscow, Russia (GMT+3:00)</SelectItem>
                        <SelectItem value="America/New_York">New York, United States (GMT-5:00)</SelectItem>
                        <SelectItem value="America/Chicago">Chicago, United States (GMT-6:00)</SelectItem>
                        <SelectItem value="America/Denver">Denver, United States (GMT-7:00)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Los Angeles, United States (GMT-8:00)</SelectItem>
                        <SelectItem value="America/Toronto">Toronto, Canada (GMT-5:00)</SelectItem>
                        <SelectItem value="America/Vancouver">Vancouver, Canada (GMT-8:00)</SelectItem>
                        <SelectItem value="America/Mexico_City">Mexico City, Mexico (GMT-6:00)</SelectItem>
                        <SelectItem value="America/Sao_Paulo">São Paulo, Brazil (GMT-3:00)</SelectItem>
                        <SelectItem value="America/Buenos_Aires">Buenos Aires, Argentina (GMT-3:00)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo, Japan (GMT+9:00)</SelectItem>
                        <SelectItem value="Asia/Shanghai">Shanghai, China (GMT+8:00)</SelectItem>
                        <SelectItem value="Asia/Hong_Kong">Hong Kong (GMT+8:00)</SelectItem>
                        <SelectItem value="Asia/Singapore">Singapore (GMT+8:00)</SelectItem>
                        <SelectItem value="Asia/Seoul">Seoul, South Korea (GMT+9:00)</SelectItem>
                        <SelectItem value="Asia/Dubai">Dubai, United Arab Emirates (GMT+4:00)</SelectItem>
                        <SelectItem value="Asia/Kolkata">Mumbai, India (GMT+5:30)</SelectItem>
                        <SelectItem value="Australia/Sydney">Sydney, Australia (GMT+11:00)</SelectItem>
                        <SelectItem value="Australia/Melbourne">Melbourne, Australia (GMT+11:00)</SelectItem>
                        <SelectItem value="Pacific/Auckland">Auckland, New Zealand (GMT+13:00)</SelectItem>
                        <SelectItem value="Africa/Johannesburg">Johannesburg, South Africa (GMT+2:00)</SelectItem>
                        <SelectItem value="Africa/Cairo">Cairo, Egypt (GMT+2:00)</SelectItem>
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
