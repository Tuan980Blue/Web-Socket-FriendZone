'use client'

import { useState } from 'react';
import { Card, TextInput, NumberInput, FileInput, Switch, Select, Button } from '@mantine/core';

interface Settings {
  siteName: string;
  siteDescription: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPassword: string;
  maxFileSize: number;
  allowedFileTypes: string;
  require2FA: boolean;
  requireEmailVerification: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: 'WebSocket Social',
    siteDescription: 'A real-time social network',
    smtpHost: '',
    smtpPort: '',
    smtpUser: '',
    smtpPassword: '',
    maxFileSize: 10,
    allowedFileTypes: 'images',
    require2FA: false,
    requireEmailVerification: true
  });

  const handleSave = () => {
    // TODO: Implement save settings logic
    console.log('Saving settings:', settings);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        System Settings
      </h1>

      <div className="grid gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            General Settings
          </h2>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="site-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Site Name
              </label>
              <TextInput
                id="site-name"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="site-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Site Description
              </label>
              <TextInput
                id="site-description"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="logo" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Logo
              </label>
              <FileInput
                id="logo"
                accept="image/*"
                placeholder="Upload logo"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Email Settings
          </h2>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="smtp-host" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SMTP Host
              </label>
              <TextInput
                id="smtp-host"
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="smtp-port" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SMTP Port
              </label>
              <TextInput
                id="smtp-port"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="smtp-user" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SMTP Username
              </label>
              <TextInput
                id="smtp-user"
                value={settings.smtpUser}
                onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="smtp-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SMTP Password
              </label>
              <TextInput
                id="smtp-password"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Security Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Two-Factor Authentication
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Require 2FA for all users
                </p>
              </div>
              <Switch
                checked={settings.require2FA}
                onChange={(e) => setSettings({ ...settings, require2FA: e.currentTarget.checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Verification
                </label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Require email verification for new accounts
                </p>
              </div>
              <Switch
                checked={settings.requireEmailVerification}
                onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.currentTarget.checked })}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upload Settings
          </h2>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="max-file-size" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Maximum File Size (MB)
              </label>
              <NumberInput
                id="max-file-size"
                value={settings.maxFileSize}
                onChange={(value) => {
                  if (typeof value === 'number') {
                    setSettings({ ...settings, maxFileSize: value });
                  }
                }}
                min={1}
                max={100}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="allowed-file-types" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Allowed File Types
              </label>
              <Select
                id="allowed-file-types"
                value={settings.allowedFileTypes}
                onChange={(value) => setSettings({ ...settings, allowedFileTypes: value || 'images' })}
                data={[
                  { value: 'images', label: 'Images only' },
                  { value: 'videos', label: 'Videos only' },
                  { value: 'all', label: 'All media types' }
                ]}
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
} 