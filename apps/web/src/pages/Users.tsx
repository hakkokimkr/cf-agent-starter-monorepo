import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input } from '@repo/ui';
import { fetcher } from '~/lib/api';
import type { User } from '@repo/shared-types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetcher<{ data: User[] }>('/api/users');
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;

    setSubmitting(true);
    try {
      await fetcher('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email }),
      });
      setName('');
      setEmail('');
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure?')) return;

    try {
      await fetcher(`/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Users</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>User List</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-500">Loading...</p>
              ) : error ? (
                <div className="space-y-2">
                  <p className="text-red-600">{error}</p>
                  <Button onClick={fetchUsers} size="sm">
                    Retry
                  </Button>
                </div>
              ) : users.length === 0 ? (
                <p className="text-gray-500">No users found</p>
              ) : (
                <div className="divide-y">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                required
              />
              <Button type="submit" loading={submitting} className="w-full">
                Add User
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
