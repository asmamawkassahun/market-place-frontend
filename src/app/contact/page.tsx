'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-5xl">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have questions about an order, merchant verification, or local payments? Our Addis Ababa based support team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Head Office</h3>
                    <p className="text-sm text-muted-foreground">Bole Medhanialem, Addis Ababa, Ethiopia</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">+251 900 000 000 / +251 116 000 000</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Email Support</h3>
                    <p className="text-sm text-muted-foreground">support@majet-marketplace.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm">Working Hours</h3>
                    <p className="text-sm text-muted-foreground">Mon - Sat: 8:30 AM - 7:00 PM (EAT)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send Us a Message</CardTitle>
                <CardDescription>Fill out the form below and we will get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="p-8 text-center space-y-4">
                    <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                    <h3 className="text-xl font-bold">Thank You!</h3>
                    <p className="text-muted-foreground">Your message has been received. Our team will contact you shortly.</p>
                    <Button variant="outline" onClick={() => setSubmitted(false)}>Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Your Name</label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Abebe Kebede"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="0911000000"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="abebe@example.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we assist you?"
                      />
                    </div>
                    <Button type="submit" className="w-full sm:w-auto cursor-pointer">
                      <Send className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

