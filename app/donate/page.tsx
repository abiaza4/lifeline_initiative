'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { campaigns, donations } from '@/lib/api';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Check, Heart, CreditCard, Building2, Wallet, Smartphone, Upload, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CampaignCardSkeleton } from '@/components/skeletons';

interface Campaign {
  id: number;
  title: string;
  description: string;
  shortDescription: string | null;
  goalAmount: number;
  raisedAmount: number;
  image: string;
  category: string;
}

export default function DonatePage() {
  const [campaignsList, setCampaignsList] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetchingCampaigns, setFetchingCampaigns] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Momo details
  const [momoNumber, setMomoNumber] = useState('');
  const [momoNetwork, setMomoNetwork] = useState('mtn');

  useEffect(() => {
    fetchCampaigns();
    if (user) {
      setDonorName(user.name);
      setDonorEmail(user.email);
    }
  }, [user]);

  const fetchCampaigns = async () => {
    try {
      const data = await campaigns.getAll({ active: true });
      setCampaignsList(data || []);
      if (data && data.length > 0) {
        setSelectedCampaign(data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch campaigns:', err);
      setError('Failed to load campaigns. Please refresh the page.');
    } finally {
      setFetchingCampaigns(false);
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    setLoading(true);
    try {
      await donations.create({
        campaignId: selectedCampaign.id,
        amount: parseFloat(amount),
        paymentMethod,
        donorName: isAnonymous ? undefined : donorName,
        donorEmail: isAnonymous ? undefined : donorEmail,
        message,
        isAnonymous,
      });
      setSuccess(true);
    } catch (error) {
      console.error('Failed to process donation:', error);
    } finally {
      setLoading(false);
    }
  };

  const presetAmounts = [25, 50, 100, 250, 500];

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 dark:from-green-950/30 to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">
              Your donation of ${amount} has been successfully processed. You will receive a confirmation email shortly.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">Return Home</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/donate">Make Another Donation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">Support Our Cause</h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your generous donation helps us make a difference in the lives of those we serve in South Sudan.
          </p>
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg max-w-2xl mx-auto">
              {error}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Campaign Selection */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Select a Campaign</CardTitle>
                <CardDescription>Choose which campaign you want to support</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {fetchingCampaigns ? (
                    <>
                      <CampaignCardSkeleton />
                      <CampaignCardSkeleton />
                    </>
                  ) : campaignsList.length > 0 ? (
                    campaignsList.map((campaign) => (
                      <div
                        key={campaign.id}
                        className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                          selectedCampaign?.id === campaign.id
                            ? 'border-primary ring-2 ring-primary/20'
                            : 'border-transparent hover:border-muted-foreground/20'
                        }`}
                        onClick={() => setSelectedCampaign(campaign)}
                      >
                        <div className="relative h-32 sm:h-40 bg-muted">
                          <Image
                            src={campaign.image || '/placeholder.jpg'}
                            alt={campaign.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        </div>
                        <div className="p-3 sm:p-4">
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{campaign.title}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-1">
                            {campaign.shortDescription || campaign.description}
                          </p>
                          <div className="mt-3">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${Math.min(
                                    campaign.goalAmount ? (campaign.raisedAmount / campaign.goalAmount) * 100 : 0,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              ${campaign.raisedAmount.toLocaleString()} of ${campaign.goalAmount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="col-span-2 text-center py-8 text-muted-foreground">
                      No active campaigns available at the moment.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Bank Transfer Details
                </CardTitle>
                <CardDescription>You can also donate via bank transfer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Bank Name:</p>
                    <p className="text-muted-foreground">Equity Bank South Sudan</p>
                  </div>
                  <div>
                    <p className="font-medium">Account Name:</p>
                    <p className="text-muted-foreground">Lifeline Initiative South Sudan</p>
                  </div>
                  <div>
                    <p className="font-medium">Account Number:</p>
                    <p className="text-muted-foreground">1001234567890</p>
                  </div>
                  <div>
                    <p className="font-medium">SWIFT Code:</p>
                    <p className="text-muted-foreground">EQBLSSJ</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> Please email your transfer receipt to donations@liss-southsudan.org with your name and contact information.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Donation Form */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Make a Donation
                </CardTitle>
                {selectedCampaign && (
                  <CardDescription>
                    Supporting: {selectedCampaign.title}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDonate} className="space-y-4">
                  <div>
                    <Label>Select Amount</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {presetAmounts.map((preset) => (
                        <Button
                          key={preset}
                          type="button"
                          variant={amount === preset.toString() ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setAmount(preset.toString())}
                        >
                          ${preset}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="customAmount">Or Enter Custom Amount</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                      <Input
                        id="customAmount"
                        type="number"
                        placeholder="Enter amount"
                        className="pl-7"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Payment Method</Label>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2"
                    >
                      <div>
                        <RadioGroupItem value="card" id="card" className="peer sr-only" />
                        <Label
                          htmlFor="card"
                          className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted text-center"
                        >
                          <CreditCard className="h-5 w-5 mb-1" />
                          <span className="text-xs">Card</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="bank_transfer" id="bank_transfer" className="peer sr-only" />
                        <Label
                          htmlFor="bank_transfer"
                          className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted text-center"
                        >
                          <Building2 className="h-5 w-5 mb-1" />
                          <span className="text-xs">Bank</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="momo" id="momo" className="peer sr-only" />
                        <Label
                          htmlFor="momo"
                          className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted text-center"
                        >
                          <Smartphone className="h-5 w-5 mb-1" />
                          <span className="text-xs">Momo</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="paypal" id="paypal" className="peer sr-only" />
                        <Label
                          htmlFor="paypal"
                          className="flex flex-col items-center justify-center p-3 border rounded-lg cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground hover:bg-muted text-center"
                        >
                          <Wallet className="h-5 w-5 mb-1" />
                          <span className="text-xs">PayPal</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Card Details Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-medium text-sm">Card Details</h4>
                      <div>
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="cardExpiry">Expiry Date</Label>
                          <Input
                            id="cardExpiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvc">CVC</Label>
                          <Input
                            id="cardCvc"
                            placeholder="123"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            maxLength={4}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Momo Details Form */}
                  {paymentMethod === 'momo' && (
                    <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                      <h4 className="font-medium text-sm">Mobile Money Details</h4>
                      <div>
                        <Label htmlFor="momoNetwork">Network</Label>
                        <select
                          id="momoNetwork"
                          value={momoNetwork}
                          onChange={(e) => setMomoNetwork(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                        >
                          <option value="mtn">MTN Mobile Money</option>
                          <option value="airtel">Airtel Money</option>
                          <option value="zain">Zain Cash</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="momoNumber">Phone Number</Label>
                        <Input
                          id="momoNumber"
                          placeholder="+211 912 345 678"
                          value={momoNumber}
                          onChange={(e) => setMomoNumber(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {!isAnonymous && (
                    <>
                      <div>
                        <Label htmlFor="donorName">Your Name</Label>
                        <Input
                          id="donorName"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          required={!isAnonymous}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="donorEmail">Email Address</Label>
                        <Input
                          id="donorEmail"
                          type="email"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          required={!isAnonymous}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="anonymous" className="text-sm cursor-pointer">
                      Donate anonymously
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                      rows={3}
                      placeholder="Leave a message of support..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={loading || !selectedCampaign || !amount}
                  >
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {loading ? 'Processing...' : `Donate $${amount || 0}`}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Secure payment powered by Stripe. Your donation may be tax-deductible.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
