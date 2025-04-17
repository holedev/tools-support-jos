'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Card,
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Eye, EyeOff, AlertCircle, X } from 'lucide-react'
import { type SMTPConfig, type SMTPCheckResult } from '../types'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export function SMTPForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showAlert, setShowAlert] = useState(true)
  const [config, setConfig] = useState<SMTPConfig>({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    from: '',
    to: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/tools/smtp-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      const result: SMTPCheckResult = await res.json()

      if (result.success) {
        toast.success('SMTP Check Successful', {
          description: result.message,
          action: {
            label: "Close",
            onClick: () => {},
          }
        })
      } else {
        toast.error('SMTP Check Failed', {
          description: result.message,
          action: {
            label: "Close",
            onClick: () => {},
          }
        })
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to check SMTP configuration ' + error,
        action: {
          label: "Close",
          onClick: () => {},
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>SMTP Server Check</CardTitle>
        <CardDescription>
          Verify your SMTP server configuration (defaults to Gmail SMTP)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showAlert && (
          <Alert className="mb-6 pr-12 relative">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Gmail Authentication Note</AlertTitle>
            <AlertDescription>
              For Gmail SMTP, you can use either:
              <ul className="mt-2 list-disc pl-4">
                <li>Regular email password (requires 2-step verification to be OFF)</li>
                <li>App password (recommended, requires 2-step verification to be ON)</li>
              </ul>
              <a 
                href="https://support.google.com/accounts/answer/185833"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-500 hover:underline"
              >
                Learn how to create an app password
              </a>
            </AlertDescription>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setShowAlert(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                placeholder="smtp.gmail.com"
                value={config.host}
                onChange={(e) => setConfig({ ...config, host: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="port">Port</Label>
              <Input
                id="port"
                type="number"
                placeholder="465"
                value={config.port}
                onChange={(e) => setConfig({ ...config, port: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username (Optional)</Label>
              <Input
                id="username"
                placeholder="your.email@gmail.com"
                value={config.username || ''}
                onChange={(e) => setConfig({ ...config, username: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (Optional)</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Email password or app password"
                  value={config.password || ''}
                  onChange={(e) => setConfig({ ...config, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="from">From Email</Label>
              <Input
                id="from"
                type="email"
                placeholder="sender@example.com"
                value={config.from || ''}
                onChange={(e) => setConfig({ ...config, from: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="to">To Email</Label>
              <Input
                id="to"
                type="email"
                placeholder="recipient@example.com"
                value={config.to || ''}
                onChange={(e) => setConfig({ ...config, to: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch
                id="secure"
                checked={config.secure}
                onCheckedChange={(checked: boolean) => setConfig({ ...config, secure: checked })}
              />
              <Label htmlFor="secure">Use SSL/TLS (recommended)</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Checking...' : 'Check Connection'}
              </Button>
              {config.from && config.to && (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Sending...' : 'Send Test Email'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}