import React from 'react'
import { useTranslation } from 'react-i18next';

function ErrorPage() {
  const { t, i18n } = useTranslation();
  return (
    <div>ErrorPage</div>
  )
}

export default ErrorPage