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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
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

const ConnectionFields = ({ config, setConfig, showPassword, setShowPassword }: any) => (
  <>
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
          onChange={(e) => {
            const value = e.target.value
            const port = value === '' ? 0 : parseInt(value)
            setConfig({ ...config, port })
          }}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="your.email@gmail.com"
          value={config.username || ''}
          onChange={(e) => setConfig({ ...config, username: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Email password or app password"
            value={config.password || ''}
            onChange={(e) => setConfig({ ...config, password: e.target.value })}
            required
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
    </div>

    <div className="flex items-center space-x-2">
      <Switch
        id="secure"
        checked={config.secure}
        onCheckedChange={(checked: boolean) => setConfig({ ...config, secure: checked })}
      />
      <Label htmlFor="secure">Use SSL/TLS (recommended)</Label>
    </div>
  </>
)

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

  const validateConfig = () => {
    if (!config.host?.trim()) {
      throw new Error('Host is required')
    }
    const port = parseInt(config.port.toString())
    if (isNaN(port) || port <= 0) {
      throw new Error('Port must be a positive number')
    }
    return true
  }

  const handleAction = async (e: React.FormEvent, mode: 'check' | 'send') => {
    e.preventDefault()
    setIsLoading(true)

    try {
      validateConfig()

      if (!config.username?.trim() || !config.password?.trim()) {
        throw new Error('Username and password are required')
      }

      if (mode === 'send' && (!config.from || !config.to)) {
        throw new Error('From and To email addresses are required for sending test email')
      }

      const requestData: Record<string, any> = {
        host: config.host,
        port: parseInt(config.port.toString()),
        secure: config.secure,
        mode
      }

      if (config.username) {
        requestData.username = config.username
        if (config.password) {
          requestData.password = config.password
        }
      }

      if (mode === 'send') {
        requestData.from = config.from
        requestData.to = config.to
      }

      const res = await fetch('/api/tools/smtp-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      const result: SMTPCheckResult = await res.json()

      if (result.success) {
        toast.success(mode === 'check' ? 'Connection Successful' : 'Test Email Sent', {
          description: result.message,
          action: {
            label: "Copy",
            onClick: () => navigator.clipboard.writeText(result.message),
          }
        })
      } else {
        const errorMessage = result.details?.error || result.message
        toast.error(mode === 'check' ? 'Connection Failed' : 'Failed to Send Email', {
          description: errorMessage,
          action: {
            label: "Copy Error",
            onClick: () => navigator.clipboard.writeText(errorMessage),
          }
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete operation'
      toast.error('Error', {
        description: errorMessage,
        action: {
          label: "Copy Error",
          onClick: () => navigator.clipboard.writeText(errorMessage),
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
          Test SMTP server connection and send test emails
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

        <Tabs defaultValue="connection" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connection">Test Connection</TabsTrigger>
            <TabsTrigger value="email">Send Test Email</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-6">
            <ConnectionFields 
              config={config} 
              setConfig={setConfig}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />
            
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={(e) => handleAction(e, 'check')}
                disabled={isLoading}
              >
                {isLoading ? 'Checking...' : 'Check Connection'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <ConnectionFields 
              config={config} 
              setConfig={setConfig}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="from">From Email</Label>
                <Input
                  id="from"
                  type="email"
                  placeholder="sender@example.com"
                  value={config.from || ''}
                  onChange={(e) => setConfig({ ...config, from: e.target.value })}
                  required
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
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={(e) => handleAction(e, 'send')}
                disabled={isLoading || !config.from || !config.to}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Sending...' : 'Send Test Email'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}