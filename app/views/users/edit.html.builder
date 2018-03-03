xml << render(partial: 'form')

xml << link_to(t(:delete), @user, method: 'delete', data: { confirm: t(:delete_are_you_sure)})