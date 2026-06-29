import { useState, type FormEvent } from 'react'
import { authApi } from '../../server/lib/api.ts'
import { useAuthStore } from '../common/stores/authStore.ts'

type Mode = 'login' | 'register'

export const Login = () => {
    const [mode, setMode] = useState<Mode>('login')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [nickname, setNickname] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const setAuth = useAuthStore((s) => s.setAuth)

    const isRegister = mode === 'register'

    const switchMode = () => {
        setMode(isRegister ? 'login' : 'register')
        setError(null)
        setPassword('')
        setConfirmPassword('')
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError(null)

        if (!username.trim() || !password) {
            setError('請輸入用戶名和密碼')
            return
        }

        if (isRegister) {
            if (password.length < 6) {
                setError('密碼長度至少 6 位')
                return
            }
            if (password !== confirmPassword) {
                setError('兩次輸入的密碼不一致')
                return
            }
        }

        setLoading(true)
        try {
            if (isRegister) {
                await authApi.register(username.trim(), password, nickname.trim() || undefined)
                // 註冊成功後自動登錄
                const { token, user } = await authApi.login(username.trim(), password)
                setAuth(token, user)
            } else {
                const { token, user } = await authApi.login(username.trim(), password)
                setAuth(token, user)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : '操作失敗，請稍後重試')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
                <h1 className="text-xl font-bold text-slate-900 text-center mb-6">
                    {isRegister ? '註冊' : '登錄'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="用戶名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />

                    {isRegister && (
                        <input
                            type="text"
                            placeholder="暱稱（可選）"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                    )}

                    <input
                        type="password"
                        placeholder="密碼"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />

                    {isRegister && (
                        <input
                            type="password"
                            placeholder="確認密碼"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                        />
                    )}

                    {error && (
                        <p className="text-sm text-red-500 text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        {loading ? '處理中...' : isRegister ? '註冊' : '登錄'}
                    </button>
                </form>

                <div className="flex justify-center gap-4 mt-4">
                    <button
                        type="button"
                        onClick={switchMode}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        {isRegister ? '返回登錄' : '註冊用戶'}
                    </button>
                    <button
                        type="button"
                        disabled
                        className="text-sm text-slate-400 cursor-not-allowed"
                        title="暫未實現"
                    >
                        忘記密碼
                    </button>
                </div>
            </div>
        </section>
    )
}
